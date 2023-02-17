"""empty message

Revision ID: 046beb3855c7
Revises: 9c5ce6071d43
Create Date: 2023-02-17 14:06:47.811484

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '046beb3855c7'
down_revision = '9c5ce6071d43'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name2', sa.String(length=50), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('name2')

    # ### end Alembic commands ###
